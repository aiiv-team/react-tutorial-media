import React from "react";
import styled from "styled-components";

const Menu = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 4px 16px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
`;

const TopMenu = () => {
  return (
    <Menu>
      <Button>
        <i className="material-icons md-24 md-light">more_vert</i>
      </Button>
    </Menu>
  );
};

export default TopMenu;
