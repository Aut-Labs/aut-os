/* eslint-disable prefer-const */
const Dots = ({ dimensions }: any) => {
  const designWidth = 1440;
  const designHeight = 800;

  // Calculate scale factors
  let scaleX = dimensions.width / designWidth;
  let scaleY = dimensions.height / designHeight;

  // Use the smaller scale factor to keep the aspect ratio
  let scale = Math.min(scaleX, scaleY);

  // Centre the design if the aspect ratios don't match
  let translateX = (dimensions.width - designWidth * scale) / 2;
  let translateY = (dimensions.height - designHeight * scale) / 2;
  return (
    <g
      transform={`translate(${translateX}, ${translateY}) scale(${scale},${scale})`}
    >
      <rect
        opacity={0.5}
        x={163.5}
        y={201}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={240.5}
        y={129}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={624.5}
        y={313}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={514.5}
        y={183}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={920.5}
        y={219}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1016.5}
        y={391}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1199.5}
        y={197}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={809.5}
        y={278}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1389.5}
        y={327}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1357.5}
        y={93}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1357.5}
        y={799}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1078.5}
        y={37}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1078.5}
        y={743}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1150.5}
        y={596}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={299.5}
        y={598}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={74.5}
        y={714}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={88.5}
        y={452}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={952.5}
        y={628}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={839.5}
        y={480}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={1231.5}
        y={454}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={871.5}
        y={798}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={428.5}
        y={494}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={719.5}
        y={526}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={871.5}
        y={91}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={516.5}
        y={662}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={684.5}
        y={732}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        id="zoom-white-bg"
        opacity={0.5}
        x={1423.5}
        y={630}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={331.5}
        y={359}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={610.5}
        y={33}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect
        opacity={0.5}
        x={610.5}
        y={739}
        width={4}
        height={4}
        fill="#576176"
      />
      <rect opacity={0.5} x={33.5} y={37} width={4} height={4} fill="#576176" />
      <rect
        opacity={0.5}
        x={33.5}
        y={743}
        width={4}
        height={4}
        fill="#576176"
      />
    </g>
  );
};

export default Dots;