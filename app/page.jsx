// app/page.jsx

import BlueyAnimator from "./components/BlueyAnimator";
import NanoBananaEditor from "./components/NanoBananaEditor";
import SketchColorAnimator from "./components/SketchColorAnimator";


export default function page() {
  return (

    <>
    <div>
        <SketchColorAnimator/>

      </div>
     <div>
        <NanoBananaEditor/>

      </div>

      <div>
        <BlueyAnimator/>

      </div>
    </>


  );
}