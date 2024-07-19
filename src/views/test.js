import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function Test() {
    const { unityProvider } = useUnityContext({
        loaderUrl: "Build/build.loader.js",
        dataUrl: "Build/build.data",
        frameworkUrl: "Build/build.framework.js",
        codeUrl: "Build/build.wasm",
    });

    return (
        <Unity unityProvider={unityProvider} style={{ width: 1600, height: 800 }} />
    );
}

export default Test;


