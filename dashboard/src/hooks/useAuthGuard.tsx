import React from 'react';
import { useHistory, useLocation } from "react-router";
import { useToggle } from 'react-use';
import { UserType, useStatusQuery } from '../generated/graphql';
import constants from "../utils/constants";

const useAuthGuard = () => {
  const [ justMount, toggle ] = useToggle(true);
  const res = useStatusQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  });
  const history = useHistory();
  const loc = useLocation();

  const fetching = res.loading;
  const user = res.data?.status.user
  const error = res.data?.status.error

  React.useEffect(() => {
    res.refetch();
    toggle(false);
  }, []);

  React.useEffect(() => {
    if(!fetching && !justMount){
      if(user && loc.pathname.includes(constants.ROUTES.AUTH)){
        if(user.type === UserType.Responder){
          history.replace(constants.ROUTES.DASHBOARD);
        }else{
          history.replace(constants.ROUTES.ADMIN);
        }
      }else if(!user && (loc.pathname.includes(constants.ROUTES.DASHBOARD) || loc.pathname.includes(constants.ROUTES.ADMIN))){
        history.replace(constants.ROUTES.AUTH);
      }else if(user && (loc.pathname.includes(constants.ROUTES.DASHBOARD) || loc.pathname.includes(constants.ROUTES.ADMIN))){
        if(user.type === UserType.Responder){
          history.replace(constants.ROUTES.DASHBOARD);
        }else{
          history.replace(constants.ROUTES.ADMIN);
        }
      }
    }else if(justMount && !user && !fetching){
      res.refetch();
    }
  }, [ fetching ]);

  return {
    user,
    refetch: () => res.refetch()
  };
};

export default useAuthGuard;
