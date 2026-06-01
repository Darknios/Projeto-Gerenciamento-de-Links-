# Deploy na VM (Nginx, porta 8088)

Passo a passo para servir o site estatico na VM existente, numa porta separada,
sem mexer no Django que ja roda la. Acesso final: `http://IP_DA_VM:8088`.

Rode tudo via SSH na VM. Troque `IP_DA_VM` pelo IP publico real.

## 1. Pre-requisitos (instala se faltar)

```bash
sudo apt update
sudo apt install -y nginx git
```

## 2. Clonar o repositorio

```bash
sudo mkdir -p /var/www
sudo git clone -b Arthur https://github.com/Darknios/Projeto-Gerenciamento-de-Links-.git /var/www/central-links
```

Se o repo for privado, o git vai pedir usuario e token (use um Personal Access
Token do GitHub no lugar da senha). Depois de mergear na `Master`, troque
`-b Arthur` por `-b Master`.

Garanta que o nginx consegue ler os arquivos:

```bash
sudo chown -R www-data:www-data /var/www/central-links
```

## 3. Criar o server block do Nginx (porta 8088)

```bash
sudo tee /etc/nginx/sites-available/central-links.conf > /dev/null <<'EOF'
server {
    listen 8088;
    listen [::]:8088;

    root /var/www/central-links;
    index Pagina_inicial.html index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/central-links.conf /etc/nginx/sites-enabled/central-links.conf
```

## 4. Testar e recarregar o Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` precisa responder "syntax is ok" e "test is successful". Se der erro,
nao recarregue (o Django continua intacto ate o reload dar certo).

## 5. Liberar a porta 8088

No firewall do sistema (se o ufw estiver ativo):

```bash
sudo ufw allow 8088/tcp
```

Se a VM estiver num provedor de nuvem (Azure, AWS, GCP, etc.), libere a porta
8088 tambem no Security Group / regra de rede de entrada do painel do provedor.

## 6. Acessar

Abra no navegador:

```
http://IP_DA_VM:8088
```

Deve cair direto na tela "Escolha a sua Squad".

## Atualizar o site depois

```bash
cd /var/www/central-links
sudo git pull
```

Arquivos estaticos nao precisam de restart; o `git pull` ja basta.

## Observacoes

- Isolamento: este server block sobe so na porta 8088. A porta 80/443 do Django
  nao e tocada.
- O backend (login e dados) e o Supabase, entao a VM so serve os arquivos; nao ha
  banco nem processo extra para rodar aqui.
- A `anon key` em `config.js` e publica por design; a seguranca vem das policies
  de RLS no Supabase (ver SETUP.md).
