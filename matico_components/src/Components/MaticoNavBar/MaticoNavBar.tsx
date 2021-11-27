import { Avatar, Button, Nav, Sidebar } from "grommet";
import { Link } from "react-router-dom";
import { Page } from "matico_spec";
import React from "react";
import * as Icons from "grommet-icons";

interface MaticoNavBarProps {
  pages: Array<Page>;
}

const NamedButton: React.FC<{ name: string }> = ({ name }) => {
  const NamedIcon = Icons[name] ? Icons[name] : Icons.Document;
  return <NamedIcon />;
};

export const MaticoNavBar: React.FC<MaticoNavBarProps> = ({ pages }) => {
  return (
    <Sidebar
      background="brand"
      round="small"
      header={
        <Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />
      }
      footer={<Button icon={<Icons.Help />} hoverIndicator />}
    >
      <Nav gap="small">
        {pages.map((page) => (
          <Link key={page.name} to={page.path ? page.path : `/${page.name}`}>
            <Button
              a11yTitle={page.name}
              icon={<NamedButton name={page.icon} />}
              hoverIndicator
            />
          </Link>
        ))}
      </Nav>
    </Sidebar>
  );
};
