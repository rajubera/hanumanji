import { createDiya } from "../objects/diya";
import { SceneManager } from "../sceneManager";

export const LitUpDiyaBtn = () => {
  let diyaCount = 0;
  const maxDiyas = 5;

  const addNewDiya = () => {
    console.log('called add new')
    const { diyaGroup } = SceneManager;
    if (diyaCount < maxDiyas) {
      diyaCount++;

      const diya = createDiya();

      // Arrange positions (in circle layout around center)
      const radius = 1;
      const angle = ((diyaCount - 1) / maxDiyas) * Math.PI * 2;
      diya.position.set(Math.cos(angle) * radius * 1, 0, Math.sin(angle) * radius);

      diyaGroup?.add(diya);
    }
  }
  return <>
    <button className="litup-btn action-menu-button" onClick={addNewDiya} title="Light up virtual Diya"
    >
      🪔 Light up virtual Diya
    </button>
  </>
}