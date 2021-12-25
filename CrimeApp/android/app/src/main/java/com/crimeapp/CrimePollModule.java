package com.crimeapp;

import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Promise;

import javax.annotation.Nonnull;

public class CrimePollModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "PeriodicCrimeFetch";
    private static ReactApplicationContext reactContext;

    public CrimePollModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService(final Promise promise) {
        MainApplication app = ((MainApplication)this.reactContext.getApplicationContext());
        boolean check = app.checkNotification();
        if(check) {
            promise.resolve(false);
            return;
        }
        Intent serviceIntent = new Intent(this.reactContext, CrimePollService.class);
        this.reactContext.startService(serviceIntent);
        HeadlessJsTaskService.acquireWakeLockNow(this.reactContext);
        app.toggleNotification(true);
        promise.resolve(true);
    }

    @ReactMethod
    public void stopService() {
        MainApplication app = ((MainApplication)this.reactContext.getApplicationContext());
        this.reactContext.stopService(new Intent(this.reactContext, CrimePollService.class));
        app.toggleNotification(false);
    }
}