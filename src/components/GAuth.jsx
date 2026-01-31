const backendUrl = import.meta.env.VITE_API_URL;
export default function GAuth({name}){

    const handleGauth=()=>{
        window.location.href = `${backendUrl}/auth/google`;
    }
    return (
        <div class="col-sm-4 gcontainer">
        
          <div class="card-body">
            <button class="btn " onClick={handleGauth}  role="button">
              <img 
                    src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png" 
                    alt="Google Logo" 
                    style={{ width: '18px', marginRight: '10px' }} />
              {name} In with Google
            </button>
          </div>
        
      </div>
    )
}