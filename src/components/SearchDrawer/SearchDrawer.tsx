import { Drawer } from "antd";
import SearchPage from "../../pages/main/SearchPage/SearchPage";

type SearchDrawerProps = {
  open: boolean;
  handleClose: () => void;
};
function SearchDrawer(props: SearchDrawerProps) {
  return (
    <Drawer
      open={props.open}
      placement="left"
      closeIcon={null}
      onClose={props.handleClose}
      bodyStyle={{
        padding: "0px",
      }}
    >
      <SearchPage handleCloseDrawer={props.handleClose} />
    </Drawer>
  );
}

export default SearchDrawer;
