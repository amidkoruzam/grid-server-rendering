function Nested({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  if (level === 0) return <div>{children}</div>;

  return (
    <div>
      <Nested level={level - 1}>{children}</Nested>
    </div>
  );
}

export const DeeplyNestedComponent = () => {
  const level = 200;
  return (
    <div className="card">
      <Nested level={level}>
        <h3>Title</h3>
      </Nested>

      <Nested level={level}>Some content</Nested>

      <Nested level={level}>
        <button>Click me</button>
      </Nested>
    </div>
  );
};
