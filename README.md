# text-classification

- Train persian models

```
fasttext supervised -input data/train/demo-persian.txt -output models/trained/demo-persian -pretrainedVectors models/base/cc.fa.300.vec -dim 300 -lr 1.0 -epoch 50 -wordNgrams 2 -minn 2 -maxn 8 -loss softmax -bucket 2000000 -thread 8 -minCount 1 -minCountLabel 1 -ws 5 -neg 10 -verbose 2
```

- Train english models

```
fasttext supervised -input data/train/demo-english.txt -output models/trained/demo-english -pretrainedVectors models/base/cc.en.300.vec -dim 300 -lr 1.0 -epoch 50 -wordNgrams 2 -minn 2 -maxn 8 -loss softmax -bucket 2000000 -thread 8 -minCount 1 -minCountLabel 1 -ws 5 -neg 10 -verbose 2
```

Quantize

```
fasttext quantize \
  -input data/train/demo-persian.txt \
  -output models/trained/demo-persian \
  -cutoff 100000 \
  -retrain \
  -thread	9
```

Test

```
./fasttext test models/trained/demo-persian.bin data/test/demo-persian.txt > tests/demo-persian.txt

./fasttext test models/trained/demo-persian.ftz data/test/demo-persian.txt > tests/demo-persian-quantized.txt
```

quantized version

```

```

fasttext test models/trained/demo-persian.ftz data/test/demo-persian.txt > tests/demo-persian-quantized.txt

```


Interference
```

fasttext predict models/trained/demo-persian.bin -

```

```
