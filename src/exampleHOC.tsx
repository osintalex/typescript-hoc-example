/**
 * Example taken from https://deadsimplechat.com/blog/higher-order-componets-in-react/
 */

import { useState } from "react";
import type { ComponentType } from "react";

// This is the basic component - call it the building block
type TextComponentProps = {
  isHovered: boolean;
  text: string;
};
const TextComponent = ({ text, isHovered }: Readonly<TextComponentProps>) => {
  return (
    <>
      <p style={{ backgroundColor: isHovered ? "blue" : "white" }}>{text}</p>
    </>
  );
};

// Put any props here that the higher order component - `withhover`
// in this example - will inject into the building block one
type InjectedProps = {
  isHovered: boolean;
};

// This is the higher order component
// First constrain generic type T to only the props that
// we've defined above in the building block component
// since those are the only supported props - the HOC
// just extracts the logic to determine those props
function withHover<T extends TextComponentProps>(
  WrappedComponent: ComponentType<T>
) {
  // Need Omit here since this function doesn't take props that
  // are determined by the HOC - in this case this is only
  // isHovered, since we inject that in the body of the function below
  return function (props: Omit<T, keyof InjectedProps>) {
    const [isHovered, setHovered] = useState(false);

    function handleMouseEnter() {
      setHovered(true);
    }

    function handleMouseLeave() {
      setHovered(false);
    }

    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Have to cast props to T here since the Omit type above makes Typescript think you're missing props,
        even though we need it to prevent type errors elsewhere when rendering the final component -
        TextComponentWithHover defined below */}
        <WrappedComponent {...(props as T)} isHovered={isHovered} />
      </div>
    );
  };
}

export const TextComponentWithHover = withHover(TextComponent);
