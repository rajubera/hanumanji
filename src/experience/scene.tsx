import { BackgroundMusic } from "./backgroundMusic";
import { DiyaGroup } from "./objects/diyaGroup";
import { Ground } from "./objects/ground";
import { HanumanJi } from "./objects/hanumanji";
import { IntroPlayer } from "./objects/introPlayer";
import { Jungle } from "./objects/jungle";
import { Lights } from "./objects/lights";
import { Sky } from "./objects/sky";
import { SceneManager } from "./sceneManager";
import { useEffect } from "react";

export const Scene = () => {

    SceneManager.init();

    useEffect(() => {
        SceneManager.animate();
        const handleResize = () => {
            const { camera, renderer } = SceneManager;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            SceneManager.stop();
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return <>
        <Sky></Sky>
        <Lights></Lights>
        <Ground></Ground>
        <Jungle></Jungle>
        <HanumanJi></HanumanJi>
        <DiyaGroup></DiyaGroup>
        <IntroPlayer></IntroPlayer>
        <BackgroundMusic></BackgroundMusic>

    </>

}