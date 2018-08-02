
using System.Collections.Generic;

namespace fileserver.Logic
{
    public class RequestManager
    {
        private static RequestManager _instance;
        private List<string> _requestKeyList;

        private RequestManager()
        {
            _requestKeyList = new List<string>();
        }

        public static RequestManager GetInstance()
        {
            if(_instance == null)
                _instance = new RequestManager();
            return _instance;
        }

        public void RegisterRequestKey(string key)
        {
            _requestKeyList.Add(key);
        }

        public bool ConsumeRequestKey(string key)
        {
            if (_requestKeyList.Contains(key))
            {
                _requestKeyList.Remove(key);
                return true;
            }

            return false;
        }
    }
}
