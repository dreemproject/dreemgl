# Dali Debugging

### Generating dali output from dreemgl/dali apps

Dali output can be enabled by editing the file, /system/platform/dali/dali_api.js

```DaliApi.emitcode = true;```

When true, dali statements are written to the console when the application runs. Each line of output starts with 'DALICODE: '. 


### odroid/tizen performance logging

Enable network debugging in dali builds. Add --enable-networklogging to the build step of dali-adaptor in dali-node-initial-build.sh

```./configure 'CXXFLAGS=-O0 -g' --enable-gles=20 --enable-profile=UBUNTU --prefix=$DESKTOP_PREFIX --enable-debug --with-node-js=/home/dali/download/node-v0.12.4/deps/uv/include/ --enable-networklogging ```

Before running a dali application:
```export DALI_LOG_PERFORMANCE_STATS=1```

In a separate console window run
```dlogutil node```

From Nick:

```
No when you running DALi it will print out this kind of info:

LogMessage(42) > Update, min 0.02 ms, max 0.05 ms, total (0.0 secs), avg 0.02 ms, std dev 0.00 ms
LogMessage(42) > Render, min 0.27 ms, max 7.76 ms, total (2.6 secs), avg 2.69 ms, std dev 2.52 ms
LogMessage(42) > Event, min 0.00 ms, max 0.00 ms, total (0.0 secs), avg 0.00 ms, std dev 0.00 ms

What does it all mean?  
Update runs our animations / does the scene graph traversal .  Ideally this should take < 1 frame. E.g.  < 16ms.  Ideally <8ms to be on the safe side.
Render does the GL calls / texture uploads.  This again should take <  16ms. Ideally < 8ms, at the moment on Odroid the compositor is on by default, so once we've rendered ( to a texture) it then re-renders us to the frame buffer ( may take about 4ms).  In the future we should be able to render direct to the screen.

Event is where the user sets up the scene / creates animations / handles input events. This can be any amount of time. This is the thread that DreemGL will be running in.
```


### Dali debugging using dump_scene/stagehand

https://dalidocs.ahcox.com/dd/dd7/md_stage-hand.html

Enable debugging in dali builds. If missing, add --enable-debug to the build step of dali-adaptor in dali-node-initial-build.sh

Before running a dali application:
```export DALI_NETWORK_CONTROL=1```

I often see an error when using stagehand (a network error). I'm more interested in a text dump. For example, on ubuntu (I'm using vmware so the ip address is 0.0.0.0, and not 127.0.0.1).

Run telnet after the dali application is started.
telnet 0.0.0.0. 3031
dump_scene

From Nick:
```
echo "dump_scene" | nc -q 4 localhost  3031  > scene.json && tail -n +2 scene.json > scene2.json  &&  firefox scene2.json
-q  4 is to let netcat wait 4 seconds before quitting.
the tail is remove the size field, as it's not in JSON format and firefox complains about it.
```

### Tracking down crashes or memory leaks

The tools valgrind and gdb can be used to help isolate issues such as crashes and memory leaks.

#### gdb
gdb should stop running if an error is found. The 'bt' command will show a stack trace. 
```
gdb --args node server.js -width 600 -height 600 -dali examples/dalitests/boxes
r
```
#### valgrind

This may run slowly so be patient. You can ctrl-C to stop running and see any reported heap leaks.
```
valgrind node server.js -width 600 -height 600 -dali examples/dalitests/boxes
```

Results of running valgrind on the boxes example
```
==96952== Mismatched free() / delete / delete []
==96952==    at 0x4C2C2BC: operator delete(void*) (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==96952==    by 0xBB9C9F: node::After(uv_fs_s*) (in /usr/local/bin/node)
==96952==    by 0xC1BBAC: uv__work_done (threadpool.c:236)
==96952==    by 0xC1D985: uv__async_event (async.c:92)
==96952==    by 0xC1DA62: uv__async_io (async.c:132)
==96952==    by 0xC2CFBC: uv__io_poll (linux-core.c:324)
==96952==    by 0xC1E575: uv_run (core.c:324)
==96952==    by 0xBADA60: node::Start(int, char**) (in /usr/local/bin/node)
==96952==    by 0x5CA2EC4: (below main) (libc-start.c:287)
==96952==  Address 0x6262e70 is 0 bytes inside a block of size 504 alloc'd
==96952==    at 0x4C2B800: operator new[](unsigned long) (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
==96952==    by 0xBBAF6E: node::Stat(v8::FunctionCallbackInfo<v8::Value> const&) (in /usr/local/bin/node)
==96952==    by 0x7B8581: v8::internal::FunctionCallbackArguments::Call(void (*)(v8::FunctionCallbackInfo<v8::Value> const&)) (in /usr/local/bin/node)
==96952==    by 0x7D9210: v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) (in /usr/local/bin/node)
==96952==    by 0x9327760740D: ???
==96952==    by 0x9327774157B: ???
==96952==    by 0x93277659E85: ???
==96952==    by 0x9327774080A: ???
==96952==    by 0x93277656F9F: ???
==96952==    by 0x93277628890: ???
==96952==    by 0x895D41: v8::internal::Execution::Call(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, int, v8::internal::Handle<v8::internal::Object>*, bool) (in /usr/local/bin/node)
==96952==    by 0xAA4549: v8::internal::Runtime_Apply(int, v8::internal::Object**, v8::internal::Isolate*) (in /usr/local/bin/node)
==96952== 
==96952== 
==96952== HEAP SUMMARY:
==96952==     in use at exit: 995,181 bytes in 258 blocks
==96952==   total heap usage: 28,816 allocs, 28,558 frees, 82,296,524 bytes allocated
==96952== 
==96952== LEAK SUMMARY:
==96952==    definitely lost: 0 bytes in 0 blocks
==96952==    indirectly lost: 0 bytes in 0 blocks
==96952==      possibly lost: 7,537 bytes in 52 blocks
==96952==    still reachable: 987,644 bytes in 206 blocks
==96952==         suppressed: 0 bytes in 0 blocks
==96952== Rerun with --leak-check=full to see details of leaked memory
==96952== 
==96952== For counts of detected and suppressed errors, rerun with: -v
==96952== ERROR SUMMARY: 231 errors from 1 contexts (suppressed: 0 from 0)
```

