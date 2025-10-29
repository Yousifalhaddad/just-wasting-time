/*
  prank-guard.js — optional external JS you can include in any prank page
  Usage:
    <script src="prank-guard.js"></script>
    <script>
      PrankGuard.init({
        allowExit: true,           // keep Ctrl+X x3 escape
        exitWindowMs: 900,         // time window for the triple press
        tryKeyboardLock: true,     // request Keyboard Lock API after you call enable()
        blockContextMenu: true,
        blockSelection: true,
        blockDrag: true,
        onExit: ()=> location.reload(), // or swap DOM to show end screen
      });
      // After your user gesture + fullscreen:
      // await document.documentElement.requestFullscreen();
      // then:
      PrankGuard.enable();
    </script>
*/
(function(global){
  const Guard = {
    _enabled:false,
    _opts:null,
    _keydown:null,
    _exitCount:0,
    _exitTimer:null,

    init(opts){
      this._opts = Object.assign({
        allowExit:true,
        exitWindowMs:900,
        tryKeyboardLock:true,
        blockContextMenu:true,
        blockSelection:true,
        blockDrag:true,
        onExit:null,
      }, opts||{});

      // prepare handlers (but don't enable yet)
      this._keydown = (e)=>{
        if(!this._enabled) return;
        // Ctrl+X ×3 exit
        if(this._opts.allowExit && e.ctrlKey && !e.altKey && !e.metaKey && (e.key==='x' || e.key==='X')){
          e.preventDefault(); e.stopPropagation();
          this._exitCount++; clearTimeout(this._exitTimer);
          this._exitTimer = setTimeout(()=> this._exitCount=0, this._opts.exitWindowMs);
          if(this._exitCount>=3){ this.disable(); if(typeof this._opts.onExit==='function') try{ this._opts.onExit(); }catch(_){} }
          return;
        }
        // Block Meta/OS and common nav combos
        if(e.key==='Meta' || e.key==='OS' || e.key==='Win'){
          try{ e.preventDefault(); e.stopImmediatePropagation(); }catch(_){}
          return;
        }
        const blocked = (
          (e.ctrlKey && (['r','R','w','t','n'].includes(e.key))) ||
          (e.key==='F5') || (e.key==='F11') || (e.key==='F12') || (e.key==='F4' && e.altKey)
        );
        if(blocked){ try{ e.preventDefault(); e.stopImmediatePropagation(); }catch(_){} return; }
      };

      if(this._opts.blockContextMenu){ window.addEventListener('contextmenu', this._blocker, true); }
      if(this._opts.blockSelection){ window.addEventListener('selectstart', this._blocker, true); }
      if(this._opts.blockDrag){ window.addEventListener('dragstart', this._blocker, true); }
    },

    async enable(){
      this._enabled = true;
      window.addEventListener('keydown', this._keydown, true);
      if(this._opts.tryKeyboardLock && navigator.keyboard && navigator.keyboard.lock){
        try{ await navigator.keyboard.lock(['F5','F11','Tab','Escape','r','R','F1','F2','F3','F4','F12','ContextMenu','Meta']); }catch(_){/* ignore */}
      }
    },

    disable(){
      this._enabled = false;
      window.removeEventListener('keydown', this._keydown, true);
    },

    _blocker(e){ e.preventDefault(); e.stopPropagation(); }
  };
  global.PrankGuard = Guard;
})(window);
