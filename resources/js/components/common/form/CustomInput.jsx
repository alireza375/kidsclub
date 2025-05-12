import React from "react";
import styled from "styled-components";
import { Input } from "antd";

const CustomInput = styled(Input)`
  box-shadow: none;
  border: 1px solid #ccc; /* Default border color */

  &:hover {
    border-color: #e74c3c; /* Custom hover border color */
  }

  &:focus {
    border-color: #e74c3c !important; /* Custom focus border color */
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important; /* Custom focus outline */
  }
`;

export default function App() {
  return <CustomInput />;
}
