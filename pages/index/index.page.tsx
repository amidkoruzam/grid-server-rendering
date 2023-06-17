import React, { useEffect, useRef } from "react";
import { DeeplyNestedComponent } from "../../components/deeply-nested-component";

export { Page };

const css = `
  body {
    margin: auto;
    max-width: 1024px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 15px;
  }

  .card {
    border: 1px solid gray;
    padding: 20px;
  }
`;

const List = ({
  children,
  countToRenderOnServer,
}: {
  children: React.ReactNode;
  countToRenderOnServer: number;
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const fakeNodes = useRef<HTMLDivElement[] | null>([]);
  const [dimensions, setDimensions] = React.useState({ height: 0, width: 0 });

  useEffect(() => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) setDimensions({ height: rect?.height, width: rect?.width });
  }, []);

  const [visible, setVisible] = React.useState<boolean[]>(
    Array.from({ length: React.Children.count(children) }).map(
      (_, i) => i <= countToRenderOnServer
    )
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, isIntersecting } = entry;

        if (
          target instanceof HTMLElement &&
          target.dataset.index !== undefined &&
          isIntersecting
        ) {
          const index = parseInt(target.dataset.index);

          if (isNaN(index)) return;

          setVisible((visible) => visible.map((v, i) => v || i === index));

          observer.unobserve(target);
        }
      });
    });

    fakeNodes.current?.forEach((divRef) => observer.observe(divRef));
    return () => observer.disconnect();
  }, []);

  return React.Children.map(children, (child, index) => {
    if (index === 0) return <div ref={itemRef}>{child}</div>;
    if (visible[index]) return child;

    return (
      <div
        data-index={index}
        ref={(element) => {
          if (fakeNodes.current && element) fakeNodes.current[index] = element;
        }}
        style={{ height: dimensions.height, width: dimensions.width }}
      />
    );
  });
};

function Page() {
  return (
    <div className="grid">
      <style>{css}</style>
      <List countToRenderOnServer={150}>
        {Array.from({ length: 150 }).map((_, index) => (
          <DeeplyNestedComponent key={index} />
        ))}
      </List>
    </div>
  );
}
