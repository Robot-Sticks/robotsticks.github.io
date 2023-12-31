import { UIButton, UIPanel, UIRow } from './libs/ui.js';
import { loginUser, logoutUser, getUserDetails } from './helper/login.js'

const loginButton = new UIButton();
const logoutButton = new UIButton();
const title = new UIPanel();
var strings;

function MenubarLogin( editor ) {    
	
	const container = new UIPanel();
	
	container.setClass( 'menu' );

	strings = editor.strings;

    var user;

    getUserDetails().then(details => {
        user = details;
    });	

	console.log("user is" ,user);

	if ( user === undefined) {
		
		setLoginUserText();

	} else {

		setLogoutUserText();
	}

	loginButton.setClass( 'login-button' );	
	
	loginButton.onClick( () => loginUser());
	logoutButton.onClick( () => logoutUser());
	
	container.add( title );
	container.add( loginButton );
	container.add( logoutButton );

	return container;
}

function setLoginUserText() {

	logoutButton.setStyle('display', ['none']);
	loginButton.setStyle('display', ['inline-block']);
	loginButton.setTextContent( strings.getKey( 'menubar/login' ) );			
	title.setClass( 'hidden' );
}

function setLogoutUserText(userDetails) {

	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/login/welcome' ) + ", " + userDetails.displayName);
	logoutButton.setTextContent( strings.getKey( 'menubar/login/logout' ) );	
	loginButton.setStyle('display', ['none']);
	logoutButton.setStyle('display', ['inline-block']);
}

export { MenubarLogin, setLoginUserText, setLogoutUserText };
