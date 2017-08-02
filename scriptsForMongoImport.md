---
layout: post

title: Scripts For Mongo Import

date: scriptsForMongoImport-

mongoimport -d testImportCmd -c projects --type tsv --headerline --file C:\Users\Dhara\Downloads\testdata.txt

perl -pe 'chomp($_); @p = split(/\t/,$_); pop(@p); $_ = join("\t",@p) . "\n";' < C:\Users\Dhara\Downloads\testdata.txt | \
mongoimport -d testImportCmd -c projects --type tsv --headerline --file C:\Users\Dhara\Downloads\testdata.txt