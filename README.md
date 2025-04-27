# text-classification

- Train persian models
```
fasttext supervised   -input data/train/combined-persian.txt   -output models/trained/combined-persian   -dim 300   -pretrainedVectors models/base/cc.fa.300.vec -lr 1.0 -epoch 50 -wordNgrams 2 -minn 3 -maxn 6 -bucket 2000000 -thread 4 -loss ns -verbose 2 
```

<!-- N       75
P@1     0.88
R@1     0.88 -->

- Train english models
```
fasttext supervised   -input data/train/combined.txt   -output models/trained/combined   -dim 300   -pretrainedVectors models/base/cc.fa.300.vec -lr 1.0 -epoch 50 -wordNgrams 2 -minn 3 -maxn 6 -bucket 2000000 -thread 4 -loss ns -verbose 2 




fasttext quantize \
  -input train-persian.txt \
  -output model-persian \
  -cutoff 50000 \
  -retrain \
  -qnorm \
  -dsub 2


  <!-- N       75
P@1     0.827
R@1     0.827 -->