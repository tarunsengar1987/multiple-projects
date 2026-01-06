namespace VistaBasket.Auth.WebAPI.CustomException
{
    public class UserSpecificException : Exception
    {
        public UserSpecificException()
        {

        }

        public UserSpecificException(string msg) : base(msg)
        {

        }
    }
}
