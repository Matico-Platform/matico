import React from 'react'

class ErrorBoundary extends React.Component{
  constructor(props:any){
    super(props)
    this.state={hasError:false}
  }

   static getDerivedStateFromError(error:any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error:any, errorInfo:any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div>

        <h1>Something went wrong.</h1>;
        <button onClick={()=> window.localStorage.removeItem("code")}>ClearCache</button>
      </div>
    }

    return this.props.children; 
  }
}

export default ErrorBoundary
