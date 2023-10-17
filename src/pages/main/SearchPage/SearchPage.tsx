import { Input } from "antd";
import { memo, useEffect, useState } from "react";
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
    <div className="flex justify-center flex-col py-6 flex-1 gap-2">
      <Input
        className="mx-6 w-auto"
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
