import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import 'fontsource-roboto';
import ScrollToTop from './components/Layout/ScrollToTop';

import SignIn from './components/User/SignIn';
import SignUp from './components/User/SignUp';
import HomePage from './components/HomePage/HomePage';
import AppHeader from './components/Layout/AppHeader'; 
import BookPage from './components/BookPage/BookPage';
import FavoritePage from './components/FavoritePage/FavoritePage';
import AuthorPage from './components/AuthorPage/AuthorPage';
import PublisherPage from './components/PublisherPage/PublisherPage';
import AllBooksPage from './components/AllBooksPage/AllBooksPage';
import AdminPage from './components/AdminPage/AdminPage';
import AllAuthorsPage from './components/AuthorPage/AllAuthorsPage';
import AllPublishersPage from './components/PublisherPage/AllPublishersPage';
import GenreBooksPage from './components/AllBooksPage/GenreBooksPage';
import SearchPage from './components/SearchPage/SearchPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root:{
    display:'flex',
    height:'100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    marginBottom:48,
  },
  content: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  const [user, setUser] = useState(null);
  const [rmh, setRmh] = useState(false);

  const unloggedUser = () => ({username:"",password:""});
  //const unloggedUser = {username:"",password:""};

  //localStorage.clear();
  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user'));

    if(parsedUser!==null){
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: parsedUser.username, password: parsedUser.password})
      };
      
      fetch('/api/login', requestOptions)
          .then(response => response.json())
          .then(data =>{ 
            data.length > 0 ? setUser(data[0]): setUser(unloggedUser());
          });
    }
    else{
      setUser(unloggedUser());
    }
    
  }, []);

  let setUserCallback = (obj) =>{
    setUser({...obj});
    localStorage.setItem('user',JSON.stringify(obj));
  };
 
  let isUserLogged = () =>{
    if(user != null)
      if(user.username !== "" && user.password !== ""){
        return true;
      }
        
    return false;
  };

  let doesLogOut = () =>{
    setUser(unloggedUser());
    localStorage.setItem('user',null);
  };

  let isMounted = () =>{
    if(user !== null) return true;
    else return false;
  };

  let remountHeader = () => setRmh(!rmh);

  if(isMounted())
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <div className={classes.root}>
            <AppHeader isLogged={isUserLogged()} userData={user} logOut={doesLogOut} rmh={rmh}/>
            <main className={classes.content}>
              <div className={classes.toolbar} />
                <ScrollToTop>
                  <Switch>
                    <Route exact path="./login"
                      render={() => (
                        isUserLogged() ?
                        <Redirect to="./" />: 
                        <SignIn setUser={setUserCallback}/>
                      )}
                    />
                    <Route exact path="./signup"
                      render={() => (
                        isUserLogged() ?
                        <Redirect to="/" />: 
                        <SignUp/>
                      )}
                    />
                    <Route exact path="./" component={HomePage}/>
                    <Route exact path="./search/:name" 
                      render={(props) => 
                        <SearchPage {...props}/>}
                    />
                    <Route exact path="./books"
                      render={(props) => 
                        <AllBooksPage {...props}/>}
                    />
                    <Route exact path="./publishers"
                      render={(props) => 
                        <AllPublishersPage {...props}/>}
                    />
                    <Route exact path="./authors"
                      render={(props) => 
                        <AllAuthorsPage {...props}/>}
                    />
                    <Route exact path="./author/:id" 
                      render={(props) => 
                        <AuthorPage {...props}/>}
                    />
                    <Route exact path="./publisher/:id" 
                      render={(props) => 
                        <PublisherPage {...props}/>}
                    />
                    <Route exact path="./book/:id" 
                      render={(props) => 
                        <BookPage user={user} remountHeader={remountHeader} {...props}/>}
                    />
                    <Route exact path="./genre/:genre" 
                      render={(props) => 
                        <GenreBooksPage {...props}/>}
                    />
                    <Route exact path="./favorites" 
                      render={(props) => 
                        (isUserLogged() ?
                          <FavoritePage user={user} remountHeader={remountHeader} {...props}/>:
                          <Redirect to="/" />
                        )}
                    />
                    <Route exact path="./admin" 
                      render={() => 
                        (isUserLogged() && user.isAdmin ?
                        <AdminPage setUser={setUserCallback}/>:
                        <Redirect to="./" />
                      )}
                    />
                  </Switch>
                </ScrollToTop>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    );

  return <></>;

}

export default App;
