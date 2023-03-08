import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});
const SplineObject = (props:any) => {
  const [isDesktop, setDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 550) {
      setDesktop(true);
    } else {
      setDesktop(false);
    }

    const updateMedia = () => {
      if (window.innerWidth > 550) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    };
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);
  return (
    <Suspense fallback={<div className='text-lg text-white'>3D Scene Loading...</div>}>
      {isDesktop?(<Spline className="fixed z-0" scene={props.scene} />):<></>}
    </Suspense>
  );
};

Spline.propTypes = {};

export default SplineObject;