package com.crimeapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.lang.Integer;

public class BootUpReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED){
        MainApplication app = ((MainApplication)context.getApplicationContext());
        boolean check = app.checkNotification();
        if(check) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //log("Starting the service in >=26 Mode from a BroadcastReceiver")
            context.startForegroundService(new Intent(context, CrimePollService.class));
            app.toggleNotification(true);
            return;
        }
        //log("Starting the service in < 26 Mode from a BroadcastReceiver")
        context.startService(new Intent(context, CrimePollService.class));
        app.toggleNotification(true);
    }
  }
}