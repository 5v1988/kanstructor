import { ComparisonOptions } from "resemblejs";

export const snapshotOptions: ComparisonOptions = {
    output: {
        errorColor: {
            red: 255,
            green: 0,
            blue: 255
        },
        errorType: "flat",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        boundingBox: {
            left: 100,
            top: 100,
            right: 400,
            bottom: 300
        }
    },
    scaleToSameSize: true,
    ignore: "antialiasing"
};