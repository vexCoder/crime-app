package com.crimeapp;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
// import com.facebook.react.jstasks.LinearCountingRetryPolicy;
// import com.facebook.react.jstasks.HeadlessJsTaskRetryPolicy ;

public class CrimePollEventService extends HeadlessJsTaskService {
    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {

      Bundle extras = intent.getExtras();
      return new HeadlessJsTaskConfig(
        "PeriodicCrimeFetch",
        extras != null ? Arguments.fromBundle(extras) : Arguments.createMap(),
        30000,
        true
      );
    }
}