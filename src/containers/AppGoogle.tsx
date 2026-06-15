import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useActor, useMachine } from "@xstate/react";
import { Container, CssBaseline } from "@mui/material";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

import { snackbarMachine } from "../machines/snackbarMachine";
import { notificationsMachine } from "../machines/notificationsMachine";
import { authService } from "../machines/authMachine";
import AlertBar from "../components/AlertBar";
import { bankAccountsMachine } from "../machines/bankAccountsMachine";
import PrivateRoutesContainer from "./PrivateRoutesContainer";

// @ts-ignore
if (window.Cypress) {
  // Expose authService on window for Cypress
  // @ts-ignore
  window.authService = authService;
}

const PREFIX = "AppGoogle";

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
  },

  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

/* istanbul ignore next */
const AppGoogle: React.FC = () => {
  const [authState] = useActor(authService);
  const [, , notificationsService] = useMachine(notificationsMachine);

  const [, , snackbarService] = useMachine(snackbarMachine);

  const [, , bankAccountsService] = useMachine(bankAccountsMachine);

  // @ts-ignore
  if (window.Cypress) {
    useEffect(() => {
      const { user, token } = JSON.parse(localStorage.getItem("googleCypress")!);
      authService.send("GOOGLE", {
        user,
        token,
      });
    }, []);
  }

  const handleGoogleSuccess = (response: CredentialResponse) => {
    if (response.credential) {
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const user = {
        email: payload.email,
        name: payload.name,
        givenName: payload.given_name,
        familyName: payload.family_name,
        imageUrl: payload.picture,
        googleId: payload.sub,
      };
      authService.send("GOOGLE", { user, token: response.credential });
    }
  };

  const isLoggedIn = authState.matches("authorized");

  return (
    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENTID!}>
      <Root className={classes.root}>
        <CssBaseline />

        {isLoggedIn && (
          <PrivateRoutesContainer
            isLoggedIn={isLoggedIn}
            notificationsService={notificationsService}
            authService={authService}
            snackbarService={snackbarService}
            bankAccountsService={bankAccountsService}
          />
        )}

        {authState.matches("unauthorized") && (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error("Google Login Failed")}
              />
            </div>
          </Container>
        )}

        <AlertBar snackbarService={snackbarService} />
      </Root>
    </GoogleOAuthProvider>
  );
};

export default AppGoogle;
