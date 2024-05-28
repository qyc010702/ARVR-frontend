import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function Test() {
    const { unityProvider } = useUnityContext({
        loaderUrl: "Build/test.loader.js",
        dataUrl: "Build/test.data",
        frameworkUrl: "Build/test.framework.js",
        codeUrl: "Build/test.wasm",
    });

    return (
        <Unity unityProvider={unityProvider} style={{ width: 1600, height: 800 }} />
    );
}

export default Test;


