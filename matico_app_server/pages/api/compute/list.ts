const base = "https://f6cc-5-148-126-126.ngrok.io";

//const base ="http://localhost:3000/compute/"
//const base ="https://matico.s3.us-east-2.amazonawshttps://f6cc-5-148-126-126.ngrok.io/.com/compute"

export const compute = [
  {
    name: "Generate Synthetic Data",
    // "path":"https://matico.s3.us-east-2.amazonaws.com/compute/synthetic_analysis/matico_synthetic_data_analysis.js"
    path: `https://matico.s3.us-east-2.amazonaws.com/compute/synthetic_analysis/matico_synthetic_data_analysis.js`,
  },
  {
    name: "Calc Weights",
    // "path":"https://matico.s3.us-east-2.amazonaws.com/compute/synthetic_analysis/matico_synthetic_data_analysis.js"
    path: `${base}/weights/matico_weights.js`,
  },
];
