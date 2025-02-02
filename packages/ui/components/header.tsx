/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const centerContent = (
    <React.Fragment>
      <Link to="/stakers">
        <Button label="Stakers" link className="mr-2" />
      </Link>
    </React.Fragment>
  );

  return (
    <header id="header" className="w-full">
      <Toolbar center={centerContent} />
    </header>
  );
};
