import React, { PropsWithChildren } from 'react';

export default function SectionContainer({ children }: PropsWithChildren<{}>) {
  return (
    <section className="section">
      <div className="container">
        {children}
      </div>
    </section>
  );
}