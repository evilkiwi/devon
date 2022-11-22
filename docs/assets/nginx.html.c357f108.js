import{_ as t,r as o,o as p,c as i,a as s,b as n,d as c,e as a}from"./app.29bc771a.js";const l={},r=a(`<h1 id="nginx-recipe" tabindex="-1"><a class="header-anchor" href="#nginx-recipe" aria-hidden="true">#</a> NGINX Recipe</h1><h2 id="configs" tabindex="-1"><a class="header-anchor" href="#configs" aria-hidden="true">#</a> Configs</h2><p>If you chose not to add an NGINX Reverse Proxy to your monorepo during the <code>devon init</code> command, you can add it using the following recipe:</p><p><code>.devon/proxy/.devconfig.ts</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> ServiceConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> ServiceConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
    compose<span class="token operator">:</span> <span class="token punctuation">{</span>
        image<span class="token operator">:</span> <span class="token string">&#39;nginx:latest&#39;</span><span class="token punctuation">,</span>
        ports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;80:80&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;443:443&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        volumes<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&#39;./.devon/proxy/sites:/etc/nginx/conf.d&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Map a \`sites\` directory to the nginx config</span>
            <span class="token string">&#39;./.devon/proxy/certs:/etc/ssl&#39;</span><span class="token punctuation">,</span> <span class="token comment">// Only needed if you need the Devon local SSL</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        restart<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>.devon.ts</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> DefinitionFile <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> DefinitionFile <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    services<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token operator">...</span>
        <span class="token punctuation">{</span>
            name<span class="token operator">:</span> <span class="token string">&#39;proxy&#39;</span><span class="token punctuation">,</span>
            path<span class="token operator">:</span> <span class="token string">&#39;.devon/proxy&#39;</span><span class="token punctuation">,</span>
            force<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// Makes sure NGINX _always_ boots</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Make sure to re-run the <code>devon switch</code> command to bring the new container up!</p></div><h2 id="site-configurations" tabindex="-1"><a class="header-anchor" href="#site-configurations" aria-hidden="true">#</a> Site Configurations</h2><p>Looking at the Docker Compose volumes in the service config, we mount a <code>.devon/proxy/sites</code> folder to the container. This directory is where you can add all of your NGINX site config files.</p>`,10),d={href:"https://vitejs.dev/",target:"_blank",rel:"noopener noreferrer"},u=a(`<p><code>.devon/proxy/sites/example.conf</code></p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">443</span> ssl</span><span class="token punctuation">;</span> <span class="token comment"># Switch this to \`listen 80;\` if not using SSL</span>
    <span class="token directive"><span class="token keyword">server_name</span> local.example.com</span><span class="token punctuation">;</span>

    <span class="token comment"># Only needed if using the Devon-managed SSL</span>
    <span class="token directive"><span class="token keyword">ssl_certificate</span> /etc/ssl/local.example.com.pem</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">ssl_certificate_key</span> /etc/ssl/local.example.com-key.pem</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Real-IP <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> X-Forwarded-For <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_set_header</span> Host <span class="token variable">$host</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_pass</span> http://host.docker.internal:3000</span><span class="token punctuation">;</span> <span class="token comment"># Points to \`localhost:3000\`</span>
        <span class="token directive"><span class="token keyword">proxy_redirect</span> <span class="token boolean">off</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">proxy_http_version</span> 1.1</span><span class="token punctuation">;</span>
	    <span class="token directive"><span class="token keyword">proxy_set_header</span> Upgrade <span class="token variable">$http_upgrade</span></span><span class="token punctuation">;</span>
	    <span class="token directive"><span class="token keyword">proxy_set_header</span> Connection <span class="token string">&quot;Upgrade&quot;</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># Remove this server if not using SSL</span>
<span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">listen</span> <span class="token number">80</span></span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">server_name</span> local.example.com</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">return</span> <span class="token number">301</span> https://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Make sure to re-run the <code>devon switch</code> command any time you change these configs to restart NGINX</p></div>`,3);function k(v,m){const e=o("ExternalLinkIcon");return p(),i("div",null,[r,s("p",null,[n("For example, to forward to a "),s("a",d,[n("Vite"),c(e)]),n(" dev server:")]),u])}const y=t(l,[["render",k],["__file","nginx.html.vue"]]);export{y as default};
