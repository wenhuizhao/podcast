import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabView, TabPanel } from 'primereact/tabview';
import { Message } from "primereact/message";
import api from "@/services/api";

const LoginPanel = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignIn = async (e) => {
        console.log('handleSignIn', email, password);
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            console.log(response.data.message);
        } catch (error) {
            console.error(error.response.data.message);
        }
    
    }

    const handleGoogleLogin = () => {
        window.location.href = '/login/google';
      };

      const handleSignUp = async (e) => {
        e.preventDefault();

        console.log(password, passwordConfirm);
        if (password !== passwordConfirm) {
            setErrorMessage("Password need match passwordConfirm");
            return;
        }
        console.log('handleSignup', email, password);
        try {
          const response = await api.post('/register', { email, password });
          console.log(response.data.message);
        } catch (error) {
          console.error(error.response.data.message);
        }
    }
    
    return(
        <TabView panelContainerStyle={{backgroundColor: 'blue', width:'500px', height:'600px'}}>
            <TabPanel header="Sign In">
                <div className="flex flex-column px-8 py-5 gap-4" style={{borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                    <Message className="inline-flex flex-column gap-2" severity="error" text={errorMessage}/>                            
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="email" className="text-primary-50 font-semibold">
                            Email
                        </label>
                        <InputText id="email" label="Email" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setEmail(e.target.value)}></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="email" className="text-primary-50 font-semibold">
                            Password
                        </label>
                        <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password" onChange={(e)=>setPassword(e.target.value)}></InputText>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Sign-In" onClick={handleSignIn} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <button onClick={handleGoogleLogin}>Login with Google</button>
                        <p><a href="/reset-password">Forgot Password?</a></p>
                    </div>
                </div>
            </TabPanel>
            <TabPanel header="Sign Up" >
            <div className="flex flex-column justify-content-between px-8 py-5 gap-4" style={{ height:'560px', borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                   
                    <Message className="inline-flex flex-column gap-2" severity="error" text={errorMessage}/>                            
                    

                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="email" className="text-primary-50 font-semibold">
                            Email
                        </label>
                        <InputText id="email" label="Email" className="bg-white-alpha-20 border-none p-3 text-primary-50" onChange={(e)=>setEmail(e.target.value)}></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="password" className="text-primary-50 font-semibold">
                            Password
                        </label>
                        <InputText id="password" label="Password" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password" onChange={(e)=>{setPassword(e.target.value);setErrorMessage('')}}></InputText>
                    </div>
                    <div className="inline-flex flex-column gap-2">
                        <label htmlFor="password" className="text-primary-50 font-semibold">
                            Password Confirm
                        </label>
                        <InputText id="passwordConfirm" label="Password Confirm" className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password" onChange={(e)=>{setPasswordConfirm(e.target.value);setErrorMessage('')}}></InputText>
                    </div>
                    <div className="flex align-items-center gap-2">
                        <Button label="Sign-Up" onClick={handleSignUp} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    )
}

export default LoginPanel;