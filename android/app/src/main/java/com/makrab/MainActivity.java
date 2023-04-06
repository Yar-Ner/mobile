package com.makrab;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import com.yandex.mapkit.MapKitFactory;
import android.content.Intent;
import android.util.Log;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.huawei.hms.rn.location.backend.helpers.HMSBroadcastReceiver;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  public boolean isOnNewIntent = false;

  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);
      isOnNewIntent = true;
      ForegroundEmitter();
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
      MapKitFactory.setApiKey("264d6d9c-dd71-4e47-9533-3302b9fac3d9"); // Your generated API key
  }

  @Override
  protected void onStart() {
      super.onStart();
      if(isOnNewIntent == true){}else {
          ForegroundEmitter();
      }
  }

  @Override
  protected String getMainComponentName() {
    return "makrab";
  }
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
       @Override
       protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
       }
    };
  }
    public  void  ForegroundEmitter(){
      // this method is to send back data from java to javascript so one can easily
      // know which button from notification or the notification button is clicked
      String  main = getIntent().getStringExtra("mainOnPress");
      String  btn = getIntent().getStringExtra("buttonOnPress");
      String  btn2 = getIntent().getStringExtra("button2OnPress");
      WritableMap  map = Arguments.createMap();
      if (main != null) {
          map.putString("main", main);
      }
      if (btn != null) {
          map.putString("button", btn);
      }
      if (btn2 != null) {
          map.putString("button", btn);
      }
      try {
          getReactInstanceManager().getCurrentReactContext()
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit("notificationClickHandle", map);
      } catch (Exception  e) {
      Log.e("SuperLog", "Caught Exception: " + e.getMessage());
      }
    }
}
