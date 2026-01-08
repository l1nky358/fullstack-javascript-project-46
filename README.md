### Hexlet tests and linter status:
[![Actions Status](https://github.com/l1nky358/fullstack-javascript-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/l1nky358/fullstack-javascript-project-46/actions)
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=l1nky358_fullstack-javascript-project-46)

$ gendiff __fixtures__/file1.yml __fixtures__/file2.yml
{
    follow: false
  - host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}

# Gendiff

Compares two configuration files and shows a difference.

## Установка

```bash
npm install -g @username/gendiff
Usage

# Установка
npm install @hexlet/code

# Использование
import genDiff from '@hexlet/code';

const diff = genDiff('file1.json', 'file2.json', 'plain');
console.log(diff);

# Установка
npm install @hexlet/code

# Использование
import genDiff from '@hexlet/code';

const diffJson = genDiff('file1.json', 'file2.json', 'json');
console.log(diffJson);

const diffPlain = genDiff('file1.json', 'file2.json', 'plain');
console.log(diffPlain);

const diffStylish = genDiff('file1.json', 'file2.json');
console.log(diffStylish);
