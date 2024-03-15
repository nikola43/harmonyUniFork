import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BlueCardShadow } from "components/Card";
import Column from "components/Column";
import Row from "components/Row";
import React, { useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { MdAvTimer, MdPerson, MdSettings } from "react-icons/md";
import { usePair } from 'state/locker/hooks';
import { useLockerState } from "state/locker/locker.store";
import { TYPE } from "theme";


function EditPair() {
  const [editStep] = useLockerState("editStep");
  const [pairSelected] = useLockerState("pairSelected");

  console.log("editStep", editStep)

  // const handlePairSelect = () => {
  //   setEditStep("pair_selected")
  // }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pair = usePair(pairSelected)

  const totalLocked = useMemo(() => pair ? pair.locks.reduce((sum, lock) => {
    if(sum)
        return sum.add(lock)
    return lock
}, undefined) : undefined, [pair])

  const lockedPercent = useMemo(() => totalLocked?.divide(pair?.totalSupply).multiply('100').toFixed(2), [totalLocked, pair])


  return (
    editStep === "pair_selected" &&
    <>
      <BlueCardShadow>
        <Row justify="space-between">
          <Column>
            <TYPE.text_sm fontWeight={600} color={"white"} >{lockedPercent}% LOCKED</TYPE.text_sm>
            <TYPE.text_xxs color={"white"} marginY={"4px"}>{totalLocked?.toFixed(6)} UNI-V2</TYPE.text_xxs>
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
