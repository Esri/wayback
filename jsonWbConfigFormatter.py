import os
import io
import json


wbconfig_fp = r'.\waybackconfig.json'
if os.path.exists(wbconfig_fp):
    wbconfig_file = open(wbconfig_fp, 'w+')
    pyjson = json.load(wbconfig_file)
    print(pyjson)


# todo: finish this script if waybackconfig.json needs further modification at large scale