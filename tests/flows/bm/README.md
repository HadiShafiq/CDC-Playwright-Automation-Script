# Bahasa Melayu flows

Same flows as `../en/`, in Bahasa Melayu. They are registered but marked **fixme** until:

1. every English flow has passed on SIT, and
2. the user has given permission to start BM (then run with `QA_LANG=BM QA_ALLOW_BM=1`, through `npm run qa -- run --lang bm`).

BM needs its own labels and messages. The Katalon step scripts switch the UI to English, so each BM step will get
BM-specific locators and expected messages discovered on the live UI. English text assertions are never reused for BM.
