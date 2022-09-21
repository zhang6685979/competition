<template>
  <div id="foot">
    <ul>
      <li>
        <h3>联系我们
        </h3>
        <p>联系电话：+86371-86589327 转8816
        </p>
        <p class="ml-70">
           +86371-86589328 转8815
        </p>
        <p>
          联系邮箱：
          <a href="mailto:urtskills@163.com" target="_blank">urtskills@163.com</a><br>
        </p>
        <p class="ml-70">
          <a href="mailto:bricsskill@jiean.net" target="_blank">bricsskill@jiean.net</a>
        </p>
      </li>
      <li>
        <h3>网站主办方
        </h3>
        <p>郑州捷安高科股份有限公司
        </p>
      </li>
    </ul>
    <div class="link">
      <span>友情链接：</span>
      <a target="_blank" href="http://www.mohrss.gov.cn/">中华人民共和国人力资源和社会保障部</a>
      <a target="_blank" href="http://www.mot.gov.cn/">中华人民共和国交通运输部</a>
      <a target="_blank" href="http://www.jantech.cn/index.html">郑州捷安高科股份有限公司</a>
      <a target="_blank" href="https://worldskills.org/">世界技能组织</a>
      <!--<a target="_blank" href="http://www.worldskillschina.cn/">世界技能大赛中国组委会</a>-->
      <a target="_blank" href="https://worldskills2022.com/">2022年上海世界技能大赛</a>
      <a target="_blank" href="http://cvsc.mohrss.gov.cn/#/home">第一届全国技能大赛</a>
    </div>
    <div class="copyright">
      <span>© 2021 Copyright All Rights Reserved 捷安高科 版权所有 </span>
      <a href="http://beian.miit.gov.cn" target="_blank">豫ICP备14008106号-2</a>
    </div>
  </div>
</template>

<script>
</script>

<style>
  #foot {
    background: #434B57;
    border-bottom: solid 1px rgba(255, 255, 255, 0.1);
    width: 100%;
    font-size:12px;
  }

  #foot ul {
    margin: 0;
    padding: 40px 0;
    list-style: none;
    max-width: 1200px;
    margin: auto;
    overflow: hidden;
  }

  #foot ul li {
    float: left;
    width: 50%;
  }

  #foot ul li h3 {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    font-weight: normal;
    border-bottom: solid 1px rgba(255, 255, 255, 0.1);
    padding: 0 30px 15px 0;
    margin: 0 0 20px;
  }

  #foot ul li a {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    margin: 10px 0 0;
  }

  #foot ul li a:hover {
    color: #fff;
  }

  #foot ul li img {
    max-width: 100%;
  }

  #foot ul li p {
    color: rgba(255, 255, 255, 0.8);
    margin: 10px 0 0;
  }

  #foot ul li p span {
    display: inline-block;
    width: 70px;
  }

  #foot ul li p a {
    display: inline-block;
    margin: 0;
  }

  #foot ul li:nth-child(4) {
    width: 27.5%;
  }

  #foot ul li:nth-child(5) {
    width: 27.5%;
  }

  #foot .link {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 0;
    color: rgba(255, 255, 255, 0.8);
    border-top: solid 1px rgba(255, 255, 255, 0.1);
  }

  #foot .link a {
    display: inline-block;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 10px;
  }

  #foot .link a:hover {
    color: #fff;
  }

  #foot .copyright {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 0;
    color: rgba(255, 255, 255, 0.8);
    border-top: solid 1px rgba(255, 255, 255, 0.1);
    text-align: center;
  }

  #foot .copyright a {
    display: inline-block;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 10px;
  }

  #foot .copyright a:hover {
    color: #fff;
  }
  .ml-70{margin-left: 65px!important;}
</style>
