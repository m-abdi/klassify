# text-classification

- Train persian models
```
fasttext supervised   -input data/train/combined-persian.txt   -output models/trained/combined-persian   -dim 300   -pretrainedVectors models/base/cc.fa.300.vec -lr 1.0 -epoch 50 -wordNgrams 2 -minn 3 -maxn 6 -bucket 2000000 -thread 4 -loss ns -verbose 2 
```

- Train english models
```
fasttext supervised   -input data/train/combined-english.txt   -output models/trained/combined-english   -dim 300   -pretrainedVectors models/base/crawl-300d-2M-subword.vec -lr 1.0 -epoch 50 -wordNgrams 2 -minn 3 -maxn 6 -bucket 2000000 -thread 4 -loss ns -verbose 2 
```


Quantize
```
fasttext quantize \
  -input data/train/combined-persian.txt \
  -output models/trained/combined-persian \
  -cutoff 100000 \
  -retrain
```


Test
```
fasttext test models/trained/combined-persian.bin data/test/combined-persian.txt > tests/combined-persian.txt

```

quantized version
```
```
fasttext test models/trained/combined-persian.ftz data/test/combined-persian.txt > tests/combined-persian-quantized.txt

```