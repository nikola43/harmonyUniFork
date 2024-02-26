import React from "react";
import Row, { AutoRow } from "components/Row";
import styled from 'styled-components'
import { TYPE } from "theme";
import uniLogo from 'assets/images/token-logo.png'
import { ButtonEmpty, ResponsiveButtonSecondary } from "components/Button";
import { BlueCardShadow } from "components/Card";
import { setEditStep, setLockerStep, useLockerState } from "state/locker/locker.store";
import Column from "components/Column";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdAvTimer, MdLockClock, MdPerson, MdPlusOne, MdSettings } from "react-icons/md";
import { FaPlus } from "react-icons/fa";


function EditPair() {
  const [editStep] = useLockerState("editStep");

  const handlePairSelect = () => {
    setEditStep("pair_selected")
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    editStep === "pair_selected" &&
    <>
      <BlueCardShadow>
        <Row justify="space-between">
          <Column>
            <TYPE.text_sm fontWeight={600} color={"white"} >24.8% LOCKED</TYPE.text_sm>
            <TYPE.text_xxs color={"white"} marginY={"4px"}>7.83 UNI-V2</TYPE.text_xxs>
            <TYPE.text_xs color={"white"} marginTop={"12px"}>Tue 20 Feb 2024 12:00</TYPE.text_xs>
          </Column>
          <Column style={{ alignSelf: "start" }}>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} style={{ width: "fit-content", padding: "12px 0px", borderRadius: "32px" }}>
              <MdSettings color="white" size={"24px"} style={{ width: "fit-content", padding: "0px" }} />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Row justify="space-between">
                  Relock
                  <MdAvTimer />
                </Row>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Row justify="space-between">
                  Transfer ownership
                  <MdPerson />
                </Row>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Row justify="space-between">
                  Increment Lock
                  <FaPlus />
                </Row>
              </MenuItem>
            </Menu>
          </Column>
        </Row>
      </BlueCardShadow>
    </>
  );
};
export default EditPair;
