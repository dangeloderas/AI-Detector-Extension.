document.getElementById("checkVideo").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: analizarVideo
    }, (results) => {
        if(results && results[0] && results[0].result){
            document.getElementById("resultado").innerText = results[0].result;
        } else {
            document.getElementById("resultado").innerText = "No se pudo analizar el video.";
        }
    });
});

// Función que se ejecuta directamente en la página
async function analizarVideo() {
    const video = document.querySelector("video");
    if(!video) return "No se encontró video en la página.";
    if(video.readyState === 0) return "Video aún no cargado.";

    const duracion = video.duration;
    const fpsEstimado = 30;
    let iguales = 0;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let prevFrame = null;

    for(let i=0; i<10; i++){
        await new Promise(resolve => {
            video.currentTime = (duracion/10) * i;
            video.onseeked = resolve;
        });

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = ctx.getImageData(0,0,canvas.width,canvas.height).data;

        if(prevFrame){
            let diff = 0;
            for(let j=0; j<frameData.length; j+=4){
                diff += Math.abs(frameData[j]-prevFrame[j]);
            }
            if(diff < 1000) iguales++;
        }
        prevFrame = frameData;
    }

    if(iguales > 5) return "Posible video generado por IA (muchos frames similares).";
    return "Video probablemente real.";
}
