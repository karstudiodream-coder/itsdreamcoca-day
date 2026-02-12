import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

const DreamcoreApp: Devvit.CustomPostComponent = (context) => {
  const [stage, setStage] = useState(0);
  const [load, setLoad] = useState(0);
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState(0);
  const [quiz, setQuiz] = useState<any[]>([]);

  const db = [
    { q: "¿Reconoces el olor de la lluvia en este pasillo?", a: "Es metálico", b: "Huele a nostalgia", v: 12 },
    { q: "El sol es una lámpara que alguien olvidó apagar.", a: "Lo sospechaba", b: "No mires arriba", v: 8 },
    { q: "¿Cuántas veces has pasado por esta puerta hoy?", a: "Demasiadas", b: "Es la primera vez", v: 14 },
    { q: "Elige un objeto del patio oxidado:", a: "Columpio roto", b: "Pelota desinflada", v: 7 },
    { q: "¿Sientes el zumbido de las luces?", a: "Está en mi cabeza", b: "Es el edificio", v: 11 },
    { q: "Hay una fiesta en el centro comercial vacío.", a: "Quiero ir", b: "Mejor me escondo", v: 5 },
    { q: "Tus recuerdos están en una cinta VHS dañada.", a: "Hay estática", b: "Faltan partes", v: 10 },
    { q: "¿Qué hay debajo del agua de la piscina?", a: "Un cielo azul", b: "Baldosas infinitas", v: 9 },
    { q: "La televisión muestra tu habitación, pero vacía.", a: "Saludaría", b: "La apagaría", v: 15 },
    { q: "¿El tiempo es un círculo o una línea mal trazada?", a: "Un bucle", b: "Una mancha", v: 13 },
    { q: "Alguien te llama desde la habitación contigua...", a: "No hay nadie allí", b: "Voy a ver", v: 6 },
    { q: "El cielo hoy tiene un color que no existe.", a: "Es hermoso", b: "Es un error", v: 11 },
    { q: "Encuentras una foto tuya de un día que no viviste.", a: "La guardo", b: "La quemo", v: 14 },
    { q: "El ascensor no tiene botones para bajar.", a: "Subo", b: "Me quedo", v: 12 },
    { q: "El horizonte se ve pixelado hoy.", a: "Baja resolución", b: "Se cae", v: 9 }
  ];

  const start = () => {
    const shuffle = [...db].sort(() => Math.random() - 0.5).slice(0, 11);
    setQuiz(shuffle);
    setStage(1);
    
    let p = 0;
    const t = setInterval(() => {
      p += Math.floor(Math.random() * 25) + 5;
      if (p >= 100) {
        setLoad(100);
        clearInterval(t);
        setStage(2);
      } else {
        setLoad(p);
      }
    }, 100);
  };

  const next = (val: number) => {
    setPoints((prev) => prev + val);
    if (step < 10) {
      setStep((prev) => prev + 1);
    } else {
      context.ui.showToast("Sincronización completa.");
      setStage(3);
    }
  };

  if (stage === 0) return (
    <vstack width="100%" height="100%" backgroundColor="#000" alignment="center middle" padding="large">
      <text size="xxlarge" weight="bold" color="#fff" outline="thin">DREAMCORE_OS</text>
      <spacer size="medium" />
      <text color="#ff00ff" weight="bold" size="medium" alignment="center">¿ESTÁS SEGURO DE QUE ESTÁS DESPIERTO?</text>
      <spacer size="large" />
      <button appearance="primary" onPress={start}>INICIAR ESCANEO</button>
      <spacer size="large" />
      <text size="xsmall" color="#333">REVVIT PROTOCOL v1.0.4</text>
    </vstack>
  );

  if (stage === 1) return (
    <vstack width="100%" height="100%" backgroundColor="#000" alignment="center middle" gap="medium">
      <text color="#fff" weight="bold" size="large">MAPEANDO MEMORIA...</text>
      <hstack width="70%" height="10px" backgroundColor="#111" border="thin" borderColor="#333">
        <hstack width={`${load}%`} height="100%" backgroundColor="#ff00ff" />
      </hstack>
      <text color="#00ffff" size="small" weight="bold">{load}%</text>
    </vstack>
  );

  if (stage === 2) {
    const item = quiz[step] || db[0];
    return (
      <vstack width="100%" height="100%" backgroundColor="#ffffff" padding="large" alignment="center middle">
        <text color="#000" weight="bold" size="xlarge" alignment="center" wrap shadow="soft">{item.q}</text>
        <spacer size="xlarge" />
        <vstack width="100%" gap="medium">
          <button appearance="bordered" onPress={() => next(item.v)}>
            <text color="#000" weight="bold">{item.a}</text>
          </button>
          <button appearance="bordered" onPress={() => next(6)}>
            <text color="#000" weight="bold">{item.b}</text>
          </button>
        </vstack>
        <spacer size="xlarge" />
        <text color="#ccc" size="xsmall" weight="bold">FRAGMENTO {step + 1} / 11</text>
      </vstack>
    );
  }

  const res = points > 100 
    ? { t: "OBSERVADOR", d: "Ves los hilos de la realidad. El vacío te reconoce.", c: "#ff00ff", i: "👁️" }
    : { t: "ENTIDAD LIMINAL", d: "Eres el eco de un lugar que nadie recuerda haber visitado.", c: "#00ffff", i: "☁️" };

  return (
    <vstack width="100%" height="100%" backgroundColor="#000" alignment="center middle" padding="medium">
      <text size="xxlarge" alignment="center">{res.i}</text>
      <text size="xlarge" weight="bold" color={res.c} alignment="center" shadow="soft">{res.t}</text>
      <spacer size="large" />
      <vstack backgroundColor="#050505" padding="large" border="thin" borderColor={res.c} width="90%">
        <text color="#fff" alignment="center" wrap size="medium">{res.d}</text>
      </vstack>
      <spacer size="large" />
      <hstack gap="medium">
        <button size="small" onPress={() => { setStage(0); setStep(0); setPoints(0); }}>REINTENTAR</button>
        <button size="small" appearance="primary" onPress={() => context.ui.showToast("Resultado archivado.")}>COMPARTIR</button>
      </hstack>
    </vstack>
  );
};

Devvit.addCustomPostType({
  name: 'Dreamcore Experience',
  height: 'tall',
  render: DreamcoreApp,
});

export default DreamcoreApp;