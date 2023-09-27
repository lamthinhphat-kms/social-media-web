import { memo, useEffect, useState } from "react";
import "./SearchPage.css";
import { Input } from "antd";
import { useMutation } from "react-query";
import UserService from "../../../api/UserService";
import ProfileTile from "../../../components/ProfileTile/ProfileTile";

type SearchPageProps = {
  handleCloseDrawer: () => void;
};

function SearchPage(props: SearchPageProps) {
  const [search, setSearch] = useState("");

  const createSearchUserMutation = useMutation({
    mutationFn: UserService.fetchUserByName,
    onSuccess: (_) => {},
  });
  useEffect(() => {
    createSearchUserMutation.mutate({
      search,
    });
  }, [search]);

  return (
    <div className="search_container">
      <Input
        className="input_search_container"
        placeholder="Search"
        size="large"
        allowClear={true}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {createSearchUserMutation.data?.map((item) => (
        <ProfileTile
          key={item.id}
          handleOnCloseDrawer={props.handleCloseDrawer}
          user={item}
        />
      ))}
    </div>
  );
}

export default memo(SearchPage);
