

self.onmessage = (e) => {
    const terms = e.data;
    let eApproximation = 1;

    let factorial = 1;
    for (let i = 1; i < terms; i++) {
        factorial *= i;
        eApproximation += 1 / factorial;
    }
      
    postMessage(eApproximation);
    
}