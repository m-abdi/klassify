# text-classification

- Train persian models

```
fasttext supervised -input data/train/combined-persian.txt -output models/trained/combined-persian -pretrainedVectors models/base/cc.fa.300.vec -dim 300 -lr 1.0 -epoch 50 -wordNgrams 2 -minn 2 -maxn 8 -loss softmax -bucket 2000000 -thread 4 -minCount 1 -minCountLabel 1 -ws 5 -neg 10 -verbose 2
```

- Train english models

```
fasttext supervised -input data/train/combined-english.txt -output models/trained/combined-english -pretrainedVectors models/base/cc.en.300.vec -dim 300 -lr 1.0 -epoch 50 -wordNgrams 2 -minn 2 -maxn 8 -loss softmax -bucket 2000000 -thread 4 -minCount 1 -minCountLabel 1 -ws 5 -neg 10 -verbose 2
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


Interference
```

fasttext predict models/trained/combined-persian.bin -

```

```
