import {useEffect,useState} from 'react';
import {DownloadCloud,RefreshCw,WifiOff,ShieldCheck,Database} from 'lucide-react';

export function OfflineUpdatePanel(){
  const [supported]=useState(()=>typeof window!=='undefined'&&'serviceWorker'in navigator);
  const [state,setState]=useState('Checking offline support…');
  const [checking,setChecking]=useState(false);
  const [waiting,setWaiting]=useState<ServiceWorker|null>(null);
  const [offline,setOffline]=useState(()=>typeof navigator!=='undefined'&&!navigator.onLine);
  useEffect(()=>{
    const online=()=>setOffline(false),offlineEvent=()=>setOffline(true);
    window.addEventListener('online',online);window.addEventListener('offline',offlineEvent);
    let registration:ServiceWorkerRegistration|undefined;
    let mounted=true;
    const inspect=()=>{if(!mounted||!registration)return;if(registration.waiting&&navigator.serviceWorker.controller){setWaiting(registration.waiting);setState('An update is downloaded and ready to install.');}else if(registration.active){setState('Offline app is installed. Your local study data is kept separately.');}};
    const onUpdateFound=()=>{const worker=registration?.installing;if(!worker)return;setState('Downloading the latest app files…');worker.addEventListener('statechange',()=>{if(worker.state==='installed'){if(navigator.serviceWorker.controller){setWaiting(worker);setState('An update is ready. Install it when convenient.');}else setState('Offline app installed for the first time.');}});};
    const onControllerChange=()=>{if(mounted&&sessionStorage.getItem('gateprep-reload-after-update')==='1'){sessionStorage.removeItem('gateprep-reload-after-update');window.location.reload();}};
    if(supported){navigator.serviceWorker.getRegistration().then(reg=>{if(!mounted)return;registration=reg;if(!reg){setState('Offline installation is not active yet. Open the app online once to install it.');return;}reg.addEventListener('updatefound',onUpdateFound);inspect();navigator.serviceWorker.addEventListener('controllerchange',onControllerChange);});}
    return()=>{mounted=false;window.removeEventListener('online',online);window.removeEventListener('offline',offlineEvent);registration?.removeEventListener('updatefound',onUpdateFound);navigator.serviceWorker?.removeEventListener('controllerchange',onControllerChange);};
  },[supported]);
  const check=async()=>{if(!supported)return;setChecking(true);setState('Checking GitHub Pages for a newer deployment…');try{const reg=await navigator.serviceWorker.getRegistration();if(!reg){setState('No service worker is registered yet. Reload once while online.');return;}await reg.update();if(reg.waiting&&navigator.serviceWorker.controller){setWaiting(reg.waiting);setState('An update is ready. Install it when convenient.');}else if(reg.installing){setState('A new version is downloading. This panel will update when it is ready.');}else setState('You are already using the latest available version.');}catch{setState(navigator.onLine?'Could not check for updates. Try again shortly.':'You are offline. The cached app remains available; reconnect to check for updates.');}finally{setChecking(false);}};
  const install=()=>{if(!waiting)return;sessionStorage.setItem('gateprep-reload-after-update','1');waiting.postMessage({type:'SKIP_WAITING'});setState('Installing update…');};
  return <div className="learning-panel offline-update-panel"><div className="offline-status-row"><div className="adm-card-icon"><WifiOff size={19}/></div><div><h2>Offline application</h2><p className="learning-hint">The app shell is cached on this device. Notes, questions, attempts and other workspace records remain in IndexedDB/local storage and are not cleared by app updates.</p></div></div><div className="offline-facts"><div><ShieldCheck size={16}/><span>{supported?'Service Worker supported':'Service Worker unavailable in this browser'}</span></div><div><Database size={16}/><span>Local data is preserved when refreshing the application</span></div><div><span className="offline-dot" data-online={!offline}/><span>{offline?'Currently offline':'Currently online'}</span></div></div><p className="offline-update-message" role="status">{state}</p><div className="offline-actions"><button className="adm-secondary" onClick={()=>void check()} disabled={!supported||checking||offline}><RefreshCw size={15}/>{checking?'Checking…':'Check for updates'}</button>{waiting&&<button className="adm-primary" onClick={install}><DownloadCloud size={15}/>Install update &amp; reload</button>}</div><p className="learning-hint">Checking for updates requires internet. Installing an update reloads the app, but does not clear IndexedDB, local storage, bookmarks, or study history. If a new version is found, it is applied only after you choose Install.</p></div>;
}
