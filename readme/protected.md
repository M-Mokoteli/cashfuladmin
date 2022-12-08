1. create a contxt
```jsx
interface iState {
    user?: iUser | null
}
interface iDispatch {
    setUser: React.Dispatch<React.SetStateAction<iUser | undefined | null>>
}

export const StateContext = createContext<iState>({} as iState)
export const DispatchContext = createContext<iDispatch>({} as iDispatch)

const MainContext: FC = (props) => {
    const [user, setUser] = useState<iUser | undefined | null>(undefined) //undefined means loading | null means not logged in
    const global_state: iState = { user }
    const global_dispatch: iDispatch = {setUser: setUser}

    return (
        <StateContext.Provider value={global_state}>
            <DispatchContext.Provider value={global_dispatch}>
                {props.children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

```

2. create a application wrapper (it will be different in rest api, or in firebase)

```jsx
export default function AppWrapper(props: PropsWithChildren<React.ReactNode>) {
    const { data, error, loading } = useQuery(Query.ME);
    const { setUser } = useContext(DispatchContext);
    const { user } = useContext(StateContext);

    useEffect(() => {
        setUser(data?.me)
    }, [data])

    // error
    if (error) {
        return <>{
            props.children
        }</>
    }
    // loading
    if (user === undefined || loading === true) {
        return (<MyLoadingSreen />);
    }
    //done
    return <>{
        props.children
    }</>
}

```

3. wrap whole app using the app warpper
```jsx
import React from 'react'

export default function App() {
  return (
      <ApolloProvider client={client}>
        <MainContext>
            <AppWrapper>
                <Router /> //created in step 5.
            </AppWrapper>
        </MainContext>
    </ApolloProvider>
  )
}

```

4. create protected route use that on any route

```jsx
export default function ProtectedRoute(props: PropsWithChildren<React.ReactNode>) {
    const { user } = useContext(StateContext);
    // send to login page if not logged in
    if (user == null) {
        return <Navigate to={URL.LOGIN} />;
    }

    return (
        <>{props.children}</>
    )
}
```


5. Router file

```jsx
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={URL.LOGIN} element={<Login />} />
                <Route path={URL.HOME} element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
                <Route path="*" element={<_404 />} />
            </Routes>
        </BrowserRouter>
    )
}
```


---

>> create a application wrapper for rest api, (graphQl version in the step 2)

```jsx
export default function AppWrapper(props: PropsWithChildren<React.ReactNode>) {
    const { setUser } = useContext(DispatchContext);
    const { user } = useContext(StateContext);
    const [loading,setLoading]=useState(true)

    useEffect(() => {
        const load=async ()=>{
            try{
                const data=await axios.get('/me')
                setUser(data?.me)
                setLoading(false)
            }catch(e){
                setUser(null)
                setLoading(false)
            }
        }
        load()
    }, [])

    // loading
    if (loading===true) {
        return (<MyLoadingSreen />);
    }
    //done
    return <>{
        props.children
    }</>
}

```